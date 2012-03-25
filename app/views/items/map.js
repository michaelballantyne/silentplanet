function (doc) {
    if (doc.record_type === 'item') {
        emit(doc.name, doc);
    }
}