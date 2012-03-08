function(doc) {
  if(doc.record_type == 'item')
    emit(doc._id, doc);
}