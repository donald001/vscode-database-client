import * as path from "path";
import { QueryUnit } from "../../service/queryUnit";
import { InfoNode } from "../other/infoNode";
import { Node } from "../interface/node";
import { DatabaseCache } from "../../service/common/databaseCache";
import { ConnectionManager } from "../../service/connectionManager";
import { Constants, ModelType, Template } from "../../common/constants";
import { TriggerNode } from "./trigger";
import { FileManager, FileModel } from "@/common/filesManager";

export class TriggerGroup extends Node {

    public iconPath: string = path.join(Constants.RES_PATH, "icon/trigger.svg");
    public contextValue = ModelType.TRIGGER_GROUP

    constructor(readonly parent: Node) {
        super("TRIGGER")
        this.id = `${parent.getConnectId()}_${parent.database}_${ModelType.TRIGGER_GROUP}`;
        this.init(parent)
    }

    public async getChildren(isRresh: boolean = false): Promise<Node[]> {

        let tableNodes = DatabaseCache.getChildListOfDatabase(this.id);
        if (tableNodes && !isRresh) {
            return tableNodes;
        }
        return QueryUnit.queryPromise<any[]>(await ConnectionManager.getConnection(this), `SELECT TRIGGER_NAME FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = '${this.database}'`)
            .then((tables) => {
                tableNodes = tables.map<TriggerNode>((table) => {
                    return new TriggerNode(table.TRIGGER_NAME, this);
                });
                DatabaseCache.setTableListOfDatabase(this.id, tableNodes);
                if (tableNodes.length == 0) {
                    return [new InfoNode("This database has no trigger")];
                }
                return tableNodes;
            })
            .catch((err) => {
                return [new InfoNode(err)];
            });
    }


    public async createTemplate() {

        ConnectionManager.getConnection(this, true);
        const filePath = await FileManager.record(`${this.parent.id}#create-trigger-template.sql`, `CREATE
/*[DEFINER = { user | CURRENT_USER }]*/
TRIGGER [name] BEFORE/AFTER INSERT/UPDATE/DELETE
ON [table]
FOR EACH ROW BEGIN

END;`, FileModel.WRITE)
        FileManager.show(filePath)

    }

}