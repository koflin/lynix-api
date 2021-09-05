export enum DocumentMetadataType {
    EDITED_AT = 1 << 1,
    EDITED_BY = 1 << 2,
    CREATED_AT = 1 << 3,
    CREATED_BY = 1 << 4,
    DELETED_AT = 1 << 5,
    DELETED_BY = 1 << 6,
    ALL = 1 << 10
}