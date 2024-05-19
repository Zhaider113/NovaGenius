const Product = require('../../model/product');
const User = require('../../model/user');

const isQueryParam = async (param) => {
  if(param && param != undefined && param != '') {
      return true;
  }
  return false;
}

const replaceString = async (str) => {
  const regex = /[^A-Za-z0-9]/g;
  let result = str.replace(regex, "-").toLowerCase();
  return result;
}


const list = async (req, res) => {
  try {
    const page =
      req.query.page && req.query.page != undefined && Number(req.query.page)
        ? Number(req.query.page)
        : 1
    const limit =
      req.query.limit && req.query.limit != undefined && Number(req.query.limit)
        ? Number(req.query.limit)
        : Number(process.env.Page_Size)
    const offset = (page - 1) * limit

    let user_id = req.user.id
    let searchStr = {}
    searchStr.user_id = user_id;
    searchStr.is_deleted = 0;

    const totalItems = await Product.count({ where: searchStr });

    let UserProducts = await Product.findAll({
      include: [
        {
          model: User,
          as: 'users',
          attributes: [
            'id',
            'name',
          ],
        },
      ],
      where: searchStr,
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']],
    })
    const totalPages = Math.ceil(totalItems / limit);

    if (UserProducts) {
      res.send({
        success: true,
        data: UserProducts,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: totalItems,
          itemsPerPage: limit,
        },
        message: 'Request was succeeded.',
      })
    } else {
      res.send({
        success: true,
        data: UserProducts,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: totalItems,
          itemsPerPage: limit,
        },
        message: 'Request was succeeded.',
      })
    }
  } catch (error) {
    res.send({ success: false, data: null, message: error.message });
  }
}

const addProducts = async (req, res) => {
  try {
    let { description, title, price } = req.body;

    if( await isQueryParam(title) && await isQueryParam(description) && await isQueryParam(price)){
      let slug = await replaceString(title)
      slug = `${slug}-${Math.random().toString(36).slice(2, 7)}`;
      Product.create({
        user_id: req.user.id,
        title:title,
        slug: slug,
        price: price,
        description:description
      }).then(product =>{
          res.send({success: true, message: 'Product Added successfully...!', data: product})
      }).catch( error =>{
        res.send({ success: false, data: null, message: error.message });
      })
    }else{
      res.send({ success: false, data: req.body, message: "All Fields Required..!" });
    }
  } catch (error) {
    res.send({ success: false, data: null, message: error.message });
  }
}

const viewProduct = async (req, res) => {
  try {
    let UserProduct = await Product.findOne({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [
        {
          model: User,
          as: 'users',
          attributes: [
            'name',
          ],
        },
      ],
      where: {
        user_id: req.user.id,
        slug: req.params.slug,
        is_deleted: 0,
      },
    })
    if (UserProduct) {
      return res.send({
        success: true,
        data: UserProduct,
        message: 'Request was succeeded.',
      })
    } else {
      return res.send({
        success: true,
        data: UserProduct,
        message: 'Request was succeeded.',
      })
    }
  } catch (error) {
    res.send({ success: false, data: null, message: error.message });
  }
}

const updateProduct = async (req, res) => {
  try {
    let { description, title, price } = req.body
    if( await isQueryParam(title) && await isQueryParam(description) && await isQueryParam(price)){
      Product.findOne({
        where: {
          id: req.body.id,
          user_id: req.user.id,
          is_deleted: 0
        }
      }).then((findProduct)=>{
        if(findProduct){
          findProduct.title = title;
          findProduct.description = description;
          findProduct.price = price;
          findProduct.save();
          res.send({success: true, message:"Product updated", data: findProduct});
        }else{
          res.send({success: false, message: "Product not found", data:null});
        }
      }).catch((error)=>{
        res.send({success: false, message: error.message, data:null});
      })
    }else{
      res.send({success: false, message: "All fields required", data: null});
    }
  } catch (error) {
    res.send({ success: false, data: null, message: error.message });
  }
}
const deleteProduct = async (req, res) => {
  try {
    Product.findOne({
      where: {
        id: req.body.id,
        user_id: req.user.id,
        is_deleted: 0
      }
    }).then((findProduct)=>{
      if(findProduct){
        findProduct.is_deleted = 1;
        findProduct.save();
        res.send({success: true, message:"Product Deleted", data: findProduct});
      }else{
        res.send({success: false, message: "Product not found", data:null});
      }
    }).catch((error)=>{
      res.send({success: false, message: error.message, data:null});
    })
  } catch (error) {
    res.send({ success: false, data: null, message: error.message });
  }
}

module.exports = {
  list,
  addProducts,
  viewProduct,
  updateProduct,
  deleteProduct,
}
