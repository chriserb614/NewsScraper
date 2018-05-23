function getNews(){
    $('#articles').empty()
    $.get('/scrape').then(function(r){
        for(i = 0; i < r.length; i++){
            var news = $(`
            <h5>` + r[i].title + `</h5><br>
            <button data-id='` + r[i]._id +  `id='savenote'>Save Note</button>
            `)
            $('#articles').append(news)

        }
    })
}

$('#scrape').on('click', function(){
    event.preventDefault()
    getNews()
    
})
