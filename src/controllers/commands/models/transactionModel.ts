import Sequelize from 'sequelize';
import { DatabaseConnection } from './databaseConnection';
import { DatabaseTableName, TransactionFieldName, TransactionEntryFieldName } from './constants/databaseNames';
import { Model, DataTypes, InitOptions, ModelAttributes, ModelAttributeColumnOptions } from 'sequelize';

// TODO: Finish models
export class TransactionModel extends Model {
	public employeeId!: number;

	public readonly id!: string;
	public readonly createdOn!: Date;
}

TransactionModel.init(
	<ModelAttributes>{
		id: <ModelAttributeColumnOptions>{
			field: TransactionFieldName.ID,
			type: DataTypes.UUID,
			autoIncrement: true,
			primaryKey: true
		},
		employeeId: <ModelAttributeColumnOptions>{
			field: TransactionFieldName.EMPLOYEE_ID,
			type: DataTypes.INTEGER,
			allowNull: true
		},
		createdOn: <ModelAttributeColumnOptions>{
			field: TransactionFieldName.CREATED_ON,
			type: new DataTypes.DATE(),
			allowNull: true
		}
	}, <InitOptions>{
		timestamps: false,
		freezeTableName: true,
		sequelize: DatabaseConnection,
		tableName: DatabaseTableName.TRANSACTION
	});

export class TransactionEntryModel extends Model {
	public readonly id!: string;
	public readonly transactionId!: Date;
	public readonly lookupCode!: Date;
	public quantity!: number;
}

TransactionEntryModel.init(
	<ModelAttributes>{
		id: <ModelAttributeColumnOptions>{
			field: TransactionEntryFieldName.ID,
			type: DataTypes.UUID,
			autoIncrement: true,
			primaryKey: true
		},
		transactionId: <ModelAttributeColumnOptions>{
			field: TransactionEntryFieldName.TRANSACTION_ID,
			type: DataTypes.INTEGER,
			allowNull: true
		},
		lookupCode: <ModelAttributeColumnOptions>{
			field: TransactionEntryFieldName.LOOKUP_CODE,
			type: new DataTypes.STRING(32),
			allowNull: true
		},
		quantity: <ModelAttributeColumnOptions>{
			field: TransactionEntryFieldName.QUANTITY,
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: 0
		}
	}, <InitOptions>{
		timestamps: false,
		freezeTableName: true,
		sequelize: DatabaseConnection,
		tableName: DatabaseTableName.TRANSACTION_ENTRY
	});


// TODO: Methods
export const queryById = async (
	id: string,
	queryTransaction?: Sequelize.Transaction
): Promise<TransactionModel | null> => {
	return TransactionModel.findOne(<Sequelize.FindOptions>{
		transaction: queryTransaction,
		where: <Sequelize.WhereAttributeHash>{ id }
	});
};
