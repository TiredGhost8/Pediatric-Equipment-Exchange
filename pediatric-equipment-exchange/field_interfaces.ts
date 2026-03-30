
export interface ItemFields {
    id: number
    name: string
    category: string
    subcategory?: string
    condition: string
    description?: string
    size: string
    color: string
    status: string
    donor: string
    image_urls: string[]
    qr_code_url: string
    created_at: string
}

export interface DistributionFields {
    id: number, 
    equipment_id: number,
    recipient_id: number,
    reserved_at: string, 
    allocated_at?: string,
    condition_at_distribution: string,
    staff_member: string,
    notes?: string,
    waiver_signed: boolean,
    signed_waiver_url?: string
    returned_at?: string
}

export interface RecipientFields {
    id: number,
    created_at: string, 
    name: string,
    contact_name: string,
    organization?: string,
    email: string,
    phone: string
}