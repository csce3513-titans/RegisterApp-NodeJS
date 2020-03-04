import Sequelize from 'sequelize';

const defaultMaximumPoolSize = 5;

export const DatabaseConnection: Sequelize.Sequelize =
	new Sequelize.Sequelize(
		<string>process.env.DATABASE_URL,
		<Sequelize.Options>{
			dialect: 'postgres',
			protocol: 'postgres',
			omitNull: true,
			freezeTableName: true,
			pool: <Sequelize.PoolOptions>{
				min: 0,
				acquire: 30000,
				max: defaultMaximumPoolSize
			},
			dialectOptions: {
				ssl: process.env.SEQUELIZE_USE_SSL === 'true'
			}
		});

export const createTransaction = async (): Promise<Sequelize.Transaction> => {
	return DatabaseConnection.transaction();
};
