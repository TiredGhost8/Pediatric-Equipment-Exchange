
export interface ItemFields {
    id: string
    name: string
    category: string
    subcategory?: string
    condition: string
    status: string
    description?: string
    size: string
    color: string
    donor: string
    image_urls: string[]
    qr_code_url: string
    created_at: string
}

export interface DistributionFields {
    id: string, 
    equipment_id: string,
    recipient_id: string,
    staff_member: string,
    reserved_at: string, 
    allocated_at?: string,
    returned_at?: string
    condition_at_distribution: string,
    notes?: string,
    waiver_signed: boolean,
    signed_waiver_url?: string
}

export interface RecipientFields {
    id: string,
    name: string,
    contact_name: string,
    organization?: string,
    email: string,
    phone: string,
    created_at: string
}