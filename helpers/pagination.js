var pagination = (function () {

    function createPagination(numberOfPages, listName) {
        var listSize = numberOfPages || 1;

        var list = $(document.createElement('ul'));
        list.attr('data-list-name', listName);
        list.addClass('pagination');
        list.addClass('center-align');

        var items = [];
        var pageNumber = 1;

        for (var i = 0; i < listSize; i++) {
            var item = $(document.createElement('li'));
            item.attr('data-page-number', pageNumber);

            if (i === 0) {
                item.addClass('active');
            }

            item.html(pageNumber);

            items.push(item);

            pageNumber++;
        }

        list.append(items);

        return list;
    }

    return {
        create: createPagination
    };
}());