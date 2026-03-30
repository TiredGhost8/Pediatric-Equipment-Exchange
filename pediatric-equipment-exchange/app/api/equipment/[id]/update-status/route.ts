// For updating an item's status
// This will update a status, and may also add entries in the distributions or recipients table depending on the transition
// And may edit an entry in the distributions table depending on the transition

import {createClient} from "@supabase/supabase-js";
import { Status } from "@/item-field-options";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! //server only
);

export async function POST(req: Request) {

  const {equipment_id, target_status, current_status, waiver_signed, distribution_id, staff_member, reservationFormData} = await req.json();
  
  // helper functions

  // update status in equipment table
  const updateEquipmentStatus = async (target_status: Status) => {
    const { data, error } = await supabase
      .from("equipment")
      .update({ status: target_status })
      .eq("id", equipment_id)
      .select()
      .single();
    if (error) throw error;
      return data;
  };

  // create an entry in recipient table
  const createRecipient = async (reservationFormData: any) => {
    if (!reservationFormData) throw new Error("Reservation form empty");
    const { data: recipient, error } = await supabase
      .from("recipient")
      .insert({
        name: reservationFormData.name,
        contact_name: reservationFormData.contact_name,
        organization: reservationFormData.organization,
        email: reservationFormData.email,
        phone: reservationFormData.phone
      })
      .select()
      .single();
    if (error) throw error;
      return recipient.id; // need this for creating/editing an entry in the Distributions table
  };

  // create an entry in distributions table (item is reserved)
  const createDistribution = async (recipient_id: string) => {
    const { data, error } = await supabase
      .from("distributions")
      .insert({
        equipment_id,
        recipient_id,
        staff_member,
        notes: reservationFormData?.notes ?? null,
      })
      .select()
      .single();
    if (error) throw error;
      return data;
  };

  // update allocated_at status in Distributions table (item is physically picked up  by family)
  const updateAllocatedAt = async () => {
    if (!distribution_id) throw new Error("Cannot return item, entry in distributions table not found");
    const { data, error } = await supabase
      .from("distributions")
      .update({ alolcated_at: new Date().toISOString() })
      .eq("id", distribution_id)
      .select()
      .single();
    if (error) throw error;
      return data;
  };

  // update returned_at status in Distributions table
  const updateReturnedAt = async () => {
    if (!distribution_id) throw new Error("Cannot return item, entry in distributions table not found");
    const { data, error } = await supabase
      .from("distributions")
      .update({ returned_at: new Date().toISOString() })
      .eq("id", distribution_id)
      .select()
      .single();
    if (error) throw error;
      return data;
  };

  // try to update the status
  try {
   /* VALID TRANSITIONS:
    AVAILABLE:
        -> Reserved = reserving an item, must start an entry in Distributions and Recipients tables
        -> In Processing = maintenance, just update status
        *NOTE: available items cannot go straight to Allocated because the Reserved status handles entering recipient info

    RESERVED:
        -> Available = item wasn't picked up, complete the entry in Distributions table (update returned_at)
        -> Allocated = Item was picked up, update Distributions table (update allocated_at). REQUIRES WAIVER SIGNATURE

    ALLOCATED:
        -> Available = item has been returned, complete the entry in Distributions table (update returned_at)
        -> In Processing = item has been returned but needs maintenance, complete the entry in Distributions table (update returned_at)

    IN PROCESSING:
        -> Available = maintenance done, just update status  */

    let result: any;
    switch (target_status) { // decide what to do depending on what the target status is 

    case "Available":
      // if allocated -> available or reserved -> available, it means the item is being returned
      if (current_status === "Allocated" || current_status === "Reserved") {
        await updateReturnedAt();
        result = await updateEquipmentStatus("Available");
      } else {
        result = await updateEquipmentStatus("Available"); // in processing -> available
      }
      break;

    case "In Processing":
      if (current_status === "Available") { // available -> in processing
        result = await updateEquipmentStatus("In Processing");
      } else if (current_status === "Allocated") { // allocated -> in processing means the item is being returned
        await updateReturnedAt();
        result = await updateEquipmentStatus("In Processing");
      } else {
        throw new Error( `Cannot go from Reserved to In Processing, make item Available first`);
      }
      break;

    case "Reserved":
      if (current_status === "Available") { // available -> reserved, create recipient data based on reservation form info & start distribution entry
        const recipient_id = await createRecipient(reservationFormData);
        result = await createDistribution(recipient_id);
        await updateEquipmentStatus("Reserved");
      } else {
        throw new Error(`Cannot go from ${current_status} to Reserved, Only Available items can be Reserved`);
      }
      break;

    case "Allocated":
      if (current_status === "Reserved") { // reserved -> allocated, family physically picks up item. Check waiver signature, update allocated_at entry in distributions table
        if (!waiver_signed) throw new Error("Waiver must be signed before allocation");
          result = await updateAllocatedAt();
          await updateEquipmentStatus("Allocated");
      } else {
        throw new Error(`Cannot go from ${current_status} to Allocated, Items must be Reserved before allocation`);
      }
      break;
    } // end of switch

    return new Response(JSON.stringify({success: true, result}), {status: 200});
  } // end of try block

  catch (error: any) {
    return new Response(JSON.stringify({success: false, error: error.message}), {status: 400}); }
}