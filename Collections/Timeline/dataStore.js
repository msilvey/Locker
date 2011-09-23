/*
*
* Copyright (C) 2011, The Locker Project
* All rights reserved.
*
* Please see the LICENSE file for more information.
*
*/
var logger = require(__dirname + "/../../Common/node/logger").logger;
var crypto = require("crypto");

// in the future we'll probably need a visitCollection too
var itemCol, respCol;

exports.init = function(iCollection, rCollection) {
    itemCol = iCollection;
//    itemCol.ensureIndex({"item":1},{unique:true},function() {});
    respCol = rCollection;
}

exports.clear = function(callback) {
    itemCol.drop(function(){respCol.drop(callback)});
}

exports.getTotalItems = function(callback) {
    itemCol.count(callback);
}
exports.getTotalResponses = function(callback) {
    respColl.count(callback);
}

exports.getItemByRefs = function(ref, callback) {
    var item;
    findWrap({refs:ref},0,1,itemCol,function(i){item=i},function(){callback(item)});
}

exports.getItemByIds = function(id, callback) {
    var item;
    findWrap({ids:id},0,1,itemCol,function(i){item=i},function(){callback(item)});
}

exports.getItem = function(id, callback) {
    var item;
    findWrap({id:id},0,1,itemCol,function(i){item=i},function(){callback(item)});
}

// either gets a single item arg:{id:...} or can paginate all arg:{start:10,limit:10}
exports.getItems = function(arg, cbEach, cbDone) {
    var f = (arg.id)?{id:arg.id}:{};
    findWrap(f,arg,itemCol,cbEach,cbDone);
}

function findWrap(a,b,c,cbEach,cbDone){
    console.log("a(" + JSON.stringify(a) + ") b("+ JSON.stringify(b) + ")");
    var cursor = c.find(a);
    if (b.sort) cursor.sort(b.sort);
    if (b.limit) cursor.limit(b.limit);
    cursor.each(function(err, item) {
        if (item != null) {
            cbEach(item);
        } else {
            cbDone();
        }
    });
}


// insert new (fully normalized) item, generate the id here and now
exports.addItem = function(item, callback) {
    var hash = crypto.createHash('md5');
    for(var i in item.ids) hash.update(i);
    item.id = hash.digest('hex');
//    logger.debug("addItem: "+JSON.stringify(item));
    itemCol.findAndModify({"id":item.id}, [['_id','asc']], {$set:item}, {safe:true, upsert:true, new: true}, callback);
}
