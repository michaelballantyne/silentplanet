function (doc) {
    if (doc.record_type === 'student') {
        emit(doc.username, doc);
    }
}