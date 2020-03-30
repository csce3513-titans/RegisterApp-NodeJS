import Sequelize from 'sequelize';
import { DatabaseConnection } from './databaseConnection';
import { TransactionFieldName, DatabaseTableName } from './constants/databaseNames';
import { Model, DataTypes, InitOptions, ModelAttributes, ModelAttributeColumnOptions } from 'sequelize';

export class TransactionModel extends Model {
	public type!: number; // TODO: The idea is to map this to different types of transactions: Sale, Return, etc.
	public total!: number;
	public cashierId!: string;
	public referenceId!: string;

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
		type: <ModelAttributeColumnOptions>{
			field: TransactionFieldName.Type,
			type: new DataTypes.STRING(256),
			allowNull: true
		},
		total: <ModelAttributeColumnOptions>{
			field: TransactionFieldName.Total,
			type: DataTypes.BIGINT,
			allowNull: true
		},
		cashierId: <ModelAttributeColumnOptions>{
			field: TransactionFieldName.CashierId,
			type: DataTypes.UUID,
			allowNull: true
		},
		createdOn: <ModelAttributeColumnOptions>{
			field: TransactionFieldName.CreatedOn,
			type: new DataTypes.DATE(),
			allowNull: true
		},
		referenceId: <ModelAttributeColumnOptions>{
			field: TransactionFieldName.ReferenceId,
			type: DataTypes.UUID,
			allowNull: true
		}
	}, <InitOptions>{
		timestamps: false,
		freezeTableName: true,
		sequelize: DatabaseConnection,
		tableName: DatabaseTableName.TRANSACTION
	}
);

// Database interaction
export const queryById = async (
	id: string,
	queryTransaction?: Sequelize.Transaction
): Promise<TransactionModel | null> => {
	return TransactionModel.findByPk(
		id,
		<Sequelize.FindOptions>{ transaction: queryTransaction });
};

export const queryByCashierId = async (
	cashierId: string,
	queryTransaction?: Sequelize.Transaction
): Promise<TransactionModel[]> => {
	return TransactionModel.findAll(<Sequelize.FindOptions>{
		transaction: queryTransaction,
		where: <Sequelize.WhereAttributeHash>{ cashierId }
	});
};
