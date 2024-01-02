let characters

$("#search").autocomplete({
    source: async function (request, response) {

        let inputTerm = request.term.toLowerCase();
        let filteredResults = await retrieveCharacter(inputTerm)
        response(filteredResults.data.map(e => e.attributes.name));

        characters = filteredResults.data

    },
    minLength: 1,
    select: function (event, ui) {

        reset()

        $(this).val(ui.item.label);

        let currentCharacter = characters.filter(e => e.attributes.name === ui.item.label)

        console.log("currentCharacter", currentCharacter);

        $('#character-name').text(`${currentCharacter[0].attributes.name}`);

        if(currentCharacter[0].attributes.image != null)
        $('#character-img').attr("src", `${currentCharacter[0].attributes.image}`);

        if(currentCharacter[0].attributes.house != null)
        setHouseColor(currentCharacter[0].attributes.house)

        setInfo(currentCharacter[0].attributes)

    }
}).on("focus", function () {
    $(this).autocomplete("search", "");
});

async function retrieveCharacter(request) {

    const response = await fetch(`https://api.potterdb.com/v1/characters/?filter[name_cont]=${request}`);
    const characters = await response.json();

    return characters;

}

function setHouseColor(house) {

    switch (house) {
        case "Gryffindor":
            $('#left-aside').css('background-color', '#740001')
            $('#right-aside').css('background-color', '#740001')
            break;

        case "Slytherin":
            $('#left-aside').css('background-color', '#1a472a')
            $('#right-aside').css('background-color', '#1a472a')
            break;

        case "Ravenclaw":
            $('#left-aside').css('background-color', '#0e1a40')
            $('#right-aside').css('background-color', '#0e1a40')
            break;

        case "Hufflepuff":
            $('#left-aside').css('background-color', '#ecb939')
            $('#right-aside').css('background-color', '#ecb939')
            break;

        default:

            $('#left-aside').css('background-color', '#5d5d5d')
            $('#right-aside').css('background-color', '#5d5d5d')
            break;
    }

    $('main').css('background-color', 'rgb(31, 30, 30)')
    $('#house-img').attr("src", `./media/img/${house}.png`)

}

function setInfo (
    {
        blood_status,
        patronus,
        born,
        height
    }
){
    blood_status == null ? blood_status = "unknown" : blood_status
    patronus == null ? patronus = "unknown" : patronus
    born == null ? born = "unknown" : born
    height == null ? height = "unknown" : height

    $('#info').html(`
    <li>Height: ${height}</li>
    <li>Born: ${born}</li>
    <li>Blood_status: ${blood_status}</li>
    <li>Patronus: ${patronus}</li>
    `)
}

function reset() {

    $('#search').val(``)
    $('#house-img').attr("src", ``)
    $('#character-name').text(``);
    $('#character-img').attr("src", ``);

    $('#left-aside').css('background-color', 'transparent')
    $('#right-aside').css('background-color', 'transparent')
    $('main').css('background-color', 'transparent')
    $('#info').html('')
}

