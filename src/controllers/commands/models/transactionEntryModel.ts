import Sequelize from 'sequelize';
import { DatabaseConnection } from './databaseConnection';
import { TransactionEntryFieldName, DatabaseTableName } from './constants/databaseNames';
import { Model, DataTypes, InitOptions, ModelAttributes, ModelAttributeColumnOptions } from 'sequelize';
import {ProductModel} from './productModel';

export class TransactionEntryModel extends Model {
	public price!: number;
	public quantity!: number;
	/** The product's lookup code */
	public productId!: string;
	public transactionId!: string;

	public readonly id!: string;
	public readonly createdOn!: Date;
}

TransactionEntryModel.init(
	<ModelAttributes>{
		id: <ModelAttributeColumnOptions>{
			field: TransactionEntryFieldName.ID,
			type: DataTypes.UUID,
			autoIncrement: true,
			primaryKey: true
		},
		price: <ModelAttributeColumnOptions>{
			field: TransactionEntryFieldName.Price,
			type: DataTypes.BIGINT,
			allowNull: true
		},
		quantity: <ModelAttributeColumnOptions>{
			field: TransactionEntryFieldName.Quantity,
			type: new DataTypes.DECIMAL(15, 4),
			allowNull: true
		},
		createdOn: <ModelAttributeColumnOptions>{
			field: TransactionEntryFieldName.CreatedOn,
			type: new DataTypes.DATE(),
			allowNull: true
		},
		productId: <ModelAttributeColumnOptions>{
			field: TransactionEntryFieldName.ProductId,
			type: DataTypes.UUID,
			allowNull: true
		},
		transactionId: <ModelAttributeColumnOptions>{
			field: TransactionEntryFieldName.TransactionId,
			type: DataTypes.UUID,
			allowNull: true
		}
	}, <InitOptions>{
		timestamps: false,
		freezeTableName: true,
		sequelize: DatabaseConnection,
		tableName: DatabaseTableName.TRANSACTION_ENTRY
	}
);

// Used for JOINS to fetch the associated product lookupcode when resuming transactions
TransactionEntryModel.belongsTo(ProductModel, { foreignKey: TransactionEntryFieldName.ProductId });

// Database interaction
export const queryById = async (
	id: string,
	queryTransaction?: Sequelize.Transaction
): Promise<TransactionEntryModel | null> => {
	return TransactionEntryModel.findByPk(id, <Sequelize.FindOptions>{ transaction: queryTransaction });
};

export const queryByProductId = async (
	productId: string,
	queryTransaction?: Sequelize.Transaction
): Promise<TransactionEntryModel[]> => {
	return TransactionEntryModel.findAll(<Sequelize.FindOptions>{
		transaction: queryTransaction,
		where: <Sequelize.WhereAttributeHash>{ productId }
	});
};

export const queryByTransactionId = async (
	transactionId: string,
	queryTransaction?: Sequelize.Transaction
): Promise<TransactionEntryModel[]> => {
	return TransactionEntryModel.findAll(<Sequelize.FindOptions>{
		transaction: queryTransaction,
		where: <Sequelize.WhereAttributeHash>{ transactionId }
	});
};

export const queryByTransactionIdAndProductId = async (
	transactionId: string,
	productId: string,
	queryTransaction?: Sequelize.Transaction
): Promise<TransactionEntryModel | null> => {
	return TransactionEntryModel.findOne(<Sequelize.FindOptions>{
		transaction: queryTransaction,
		where: <Sequelize.WhereAttributeHash>{ productId, transactionId }
	});
};
