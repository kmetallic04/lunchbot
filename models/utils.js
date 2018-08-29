const Vendor = require('./vendors');
// const Item   = require('../models/items');
// const Order  = require('../models/orders');

const { log } = require('../src/utils');

const pickModel = (modelTag)=> {
    let model;
    switch (modelTag) {
        case 'vendor':
            model = Vendor;
            break;
        // case 'item':
        //     model = Item;
        //     break;
        // case 'order':
        //     model = Order;
        //     break;
        default:
            log.error('Unknown model tag. Bad thing!!');
    }
    return model;
}

const wrapData = (data) => {
    return data instanceof Error ? { failure: data } : { success: data }
}

const getAll = async (modelTag) => {
    const Model = pickModel(modelTag);
    const data = await Model.find({}, null);
    return wrapData(data);
}

const get = async (modelTag, lookup) => {
    const query = {
        name: {
            $regex: lookup,
            $options: 'i'
        }
    }
    const Model = pickModel(modelTag);

    const data = await Model.findOne(query, null, { lean: true });
    return wrapData(data);
}

const create = async (modelTag, details) => {
    const Model = pickModel(modelTag);

    const data = await Model.create(details);
    return wrapData(data);
}

const update = async (modelTag, _id, updates) => {
    const query = { _id };
    const Model = pickModel(modelTag);

    const options = {
        new: true,
        upsert: true
    }

    const data = await Model.updateOne(query, updates, options)
    return wrapData(data);
}

const delete_ = async (modelTag, _id) => {
    const query = { _id };
    const Model = pickModel(modelTag);

    const data = await Model.deleteOne(query)
    return wrapData(data);
}

module.exports = {
    getAll,
    get,
    create,
    update,
    delete_
}
