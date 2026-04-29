alter table "public"."clinics" drop constraint "clinics_name_key";

drop index if exists "public"."clinics_name_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public._reserve_item(p_equipment_id uuid, p_user_id uuid, p_reservation_data jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$

DECLARE 

v_recipient_id uuid;
v_clinic_id uuid;

BEGIN

    IF p_reservation_data IS NULL THEN 
        RAISE EXCEPTION 'Reservation data not found'
        USING ERRCODE = 'P0002'; -- http 404 not found
    END IF;

    -- Update the status in the equipment table
    UPDATE equipment
    SET status = 'Reserved - Needs Signature'
    WHERE id = p_equipment_id;

    -- Insert the clinic into clinic tables if it has a new name
    INSERT INTO clinics (name)
    VALUES (p_reservation_data->>'clinic')
    ON CONFLICT (name) DO NOTHING; -- don't duplicate clinic names
    
    SELECT id INTO v_clinic_id -- get the clinic id
    FROM clinics
    WHERE name = p_reservation_data->>'clinic';
    
    -- Create an entry in the recipient table, adding in the new clinic id, and return the new recip id
    INSERT INTO recipient (name, contact_name, email, phone, authorized_for_pickup, clinic_id) 
    VALUES (
        p_reservation_data->>'name',
        p_reservation_data->>'contact_name',
        p_reservation_data->>'email',
        p_reservation_data->>'phone',
        p_reservation_data->>'authorized_for_pickup',
        v_clinic_id
    )
    RETURNING id INTO v_recipient_id;

    -- Use the p_equipment_id & newly created recipient id to create entry in Distributions table
    INSERT INTO distributions (equipment_id, recipient_id, notes, reserved_by)
    VALUES (p_equipment_id, v_recipient_id, p_reservation_data->>'notes', p_user_id);
   
END;
$function$
;


