var html_utils = {};

html_utils.generateTable = (table_array) =>  {
    table_array.array.forEach(row => {
        row.array.forEach(element => {

        });
    });
};

html_utils.generateUploadForm = () => {
    return '<form action="fileupload" method="post" enctype="multipart/form-data">'+
           '<input type="file" name="filetoupload"><br><input type="submit"></form>';
};

module.exports = html_utils;