import * as mysql from "mysql2";
import { ColumnMeta } from "../../model/other/columnMeta";

export class RunResponse {
    public sql: string;
}

export class MessageResponse {
    public message: string;
    public success: boolean;
}

export class DataResponse {
    public sql: string;
    public costTime: number;
    public primaryKey: string;
    public columnList: ColumnMeta[];
    public database?: string;
    public table: string | null;
    public data: any[];
    public fields: mysql.FieldInfo[];
    public pageSize: number;
    public tableCount: number;
}
export class ErrorResponse {
    public sql: string;
    public costTime: number;
    public message: string;
}

export class DMLResponse {
    public sql: string;
    public costTime: number;
    public message?: string;
    public affectedRows: number;
}
