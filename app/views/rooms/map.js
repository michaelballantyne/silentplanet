function(doc) {
  if(doc.record_type == 'room')
    emit(doc._id, doc);
}