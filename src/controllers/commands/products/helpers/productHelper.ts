import * as Helper from '../../helpers/helper';
import { Product } from '../../../typeDefinitions';
import { ProductModel } from '../../models/productModel';

export const mapProductData = (queriedProduct: ProductModel): Product => {
	return <Product>{
		id: queriedProduct.id,
		count: queriedProduct.count,
		price: queriedProduct.price,
		lookupCode: queriedProduct.lookupCode,
		createdOn: Helper.formatDate(queriedProduct.createdOn)
	};
};
