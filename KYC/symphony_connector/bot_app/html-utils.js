var html_utils = {};

html_utils.generateTable = (table_array) =>  {
    let table_html = '<table>';
    table_array.forEach(row => {
        table_html += '<tr>';
        row.forEach(element => {
            table_html += '<td>' + element + '</td>';
        });
        table_html += '</tr>';
    });
    return table_html + '</table>';
};

html_utils.generateCard = (header, body, icon_src) => {
    return '<h2>Cards</h2><card accent=\"tempo-bg-color--blue\" iconSrc=\"'+
           icon_src + '\"><header>' + header +
           '</header><body>' + body + '</body> </card>';

};

html_utils.generateUploadForm = () => {
    return '<form action="fileupload" method="post" enctype="multipart/form-data">'+
           '<input type="file" name="filetoupload"><br><input type="submit"></form>';
};

module.exports = html_utils;