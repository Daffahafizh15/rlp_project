export declare class CreateAddressDto {
    label: string;
    recipientName: string;
    phoneNumber: string;
    fullAddress: string;
    city: string;
    province: string;
    postalCode: string;
    shippingZoneId: string;
    isDefault?: boolean;
}
export declare class UpdateAddressDto {
    label?: string;
    recipientName?: string;
    phoneNumber?: string;
    fullAddress?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    shippingZoneId?: string;
    isDefault?: boolean;
}
