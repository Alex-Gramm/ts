import { Sequelize } from 'sequelize-typescript';
import config from '../../config/config';

const sequelize = new Sequelize(config.connection.mysql);

export default sequelize;
