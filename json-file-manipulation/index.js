import { promises as fs } from 'fs';
import { Console } from 'console';

let citiesByState = [];

initApp();

async function initApp(){
    
    const citiesBuffer = await fs.readFile("./source-files/Cidades.json");
    const statesBuffer = await fs.readFile("./source-files/Estados.json");

    const cities = JSON.parse(citiesBuffer);
    const states = JSON.parse(statesBuffer);

    await WriteStateFiles(states, cities)
    await CountStateCities("MG");
    await TopFiveStatesInNumberOfCities(states);
    await BigAndSmallNamesByState(states);
}

async function WriteStateFiles(states, cities){
    for(const state of states){
        const filtered = cities.filter(city=>city.Estado === state.ID);
        citiesByState.push(filtered);
        await fs.writeFile(`./states/${state.Sigla}.json`, JSON.stringify(filtered));
    }
}

async function CountStateCities(stateAcronym){
    const stateBuffer = await fs.readFile(`./states/${stateAcronym}.json`);
    const cities = JSON.parse(stateBuffer);

    console.log(`\nO estado ${stateAcronym} possui ${cities.length}`);

    return cities.length;
}

async function TopFiveStatesInNumberOfCities(states){

    let countedCities = [];

    for (const state of states){
        var citiesCounted = await CountStateCities(state.Sigla);
        var counted = {acronym: state.Sigla, cities: citiesCounted}
        countedCities.push(counted);
    }

    const sorted = countedCities.sort((a,b)=>{
        return b.cities - a.cities;
    });

    console.log("\n------MOST CITIES-------");

    for(let i=0; i<5; i++)
        console.log(`${sorted[i].acronym} - ${sorted[i].cities}`);

    console.log("\n------LESS CITIES-------");

    var bottom = sorted.length;

    for(let i=bottom-5; i<bottom; i++)
        console.log(`${sorted[i].acronym} - ${sorted[i].cities}`);
}

async function BigAndSmallNamesByState(states){

    var biggestNames = [];
    var smallestNames = [];

    console.log("\n----- Maiores nomes por estado ------");

    for (const state of states){
        const stateBuffer = await fs.readFile(`./states/${state.Sigla}.json`);
        const cities = JSON.parse(stateBuffer);
        const ordered = cities.sort((a,b)=>{
            return a.Nome.localeCompare(b.Nome);
        }).sort((a,b)=>{
            return b.Nome.length - a.Nome.length;
        });
        console.log(`A cidade com maior nome em ${state.Sigla} é ${ordered[0].Nome}`)
        biggestNames.push({state: state.Sigla, name: ordered[0].Nome});
    }

    console.log("\n----- Menores nomes por estado ------");

    for (const state of states){
        const stateBuffer = await fs.readFile(`./states/${state.Sigla}.json`);
        const cities = JSON.parse(stateBuffer);
        const ordered = cities.sort((a,b)=>{
            return a.Nome.localeCompare(b.Nome);
        }).sort((a,b)=>{
            return a.Nome.length - b.Nome.length;
        });
        console.log(`A cidade com menor nome em ${state.Sigla} é ${ordered[0].Nome}`)
        smallestNames.push({state: state.Sigla, name: ordered[0].Nome});
    }

    const biggestName = biggestNames.sort((a,b)=>{
        return a.name.localeCompare(b.name);
    }).sort((a,b)=>{
        return b.name.length - a.name.length;
    })[0];

    const smallestName = smallestNames.sort((a,b)=>{
        return a.name.localeCompare(b.name);
    }).sort((a,b)=>{
        return a.name.length - b.name.length;
    })[0];

    console.log("\n\n");

    console.log(`Maior nome do Brasil ${biggestName.name}`);
    console.log(`Menor nome do Brasil ${smallestName.name}`);

}


