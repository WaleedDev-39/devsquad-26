import { Document } from 'mongoose';
export type RawMaterialDocument = RawMaterial & Document;
export declare class RawMaterial {
    name: string;
    unit: string;
    currentStock: number;
    minimumStockAlert: number;
}
export declare const RawMaterialSchema: import("mongoose").Schema<RawMaterial, import("mongoose").Model<RawMaterial, any, any, any, any, any, RawMaterial>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, RawMaterial, Document<unknown, {}, RawMaterial, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<RawMaterial & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, RawMaterial, Document<unknown, {}, RawMaterial, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RawMaterial & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    unit?: import("mongoose").SchemaDefinitionProperty<string, RawMaterial, Document<unknown, {}, RawMaterial, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RawMaterial & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    currentStock?: import("mongoose").SchemaDefinitionProperty<number, RawMaterial, Document<unknown, {}, RawMaterial, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RawMaterial & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    minimumStockAlert?: import("mongoose").SchemaDefinitionProperty<number, RawMaterial, Document<unknown, {}, RawMaterial, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RawMaterial & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, RawMaterial>;
