function(doc) {
  if(doc.record_type == 'problem')
    emit(doc._id, doc);
}