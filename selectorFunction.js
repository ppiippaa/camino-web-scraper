const findSingleEntry = async (page, selector) => {
    return await page.$$eval(selector, (elements) => {
        if (elements.length > 0) {
            const el = elements[0];
            // exception for phone and town fields
            if(el.tagName === 'A' && !el.parentElement.classList.contains('field-item')) {
                return el.href
            }
            if (el.tagName === 'IMG') {
                return el.src
            }
            return el.textContent
        }
        return null;
    })
}

module.exports = findSingleEntry;

