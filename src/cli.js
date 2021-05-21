#!/usr/bin/env node
require('dotenv').config()

const program = require("commander");
const chalk = require("chalk");
const axios = require('axios')
const Table = require('cli-table');
const chars = { 
    'top': '═' , 
    'top-mid': '╤' , 
    'top-left': '╔' , 
    'top-right': '╗', 
    'bottom': '═' , 
    'bottom-mid': '╧' , 
    'bottom-left': '╚' , 
    'bottom-right': '╝', 
    'left': '║' , 
    'left-mid': '╟' , 
    'mid': '─' , 'mid-mid': '┼', 
    'right': '║' , 
    'right-mid': '╢' , 
    'middle': '│' 
}
const allTable = new Table({
    head: [
        chalk.cyan('Name'),
        chalk.cyan('Price wrt Base'), 
    ],
    chars: chars});

const detailTable = new Table({
        head: [
            chalk.magenta('Symbol'),
            chalk.magenta('Full Name'), 
        ],
        chars: chars});

const BASE_URL=process.env.BASE_URL
const API_KEY =process.env.API_KEY

program
  .version("1.0.0")
  .description("A CLI Tool to get real time exchange rates for over 168 world currencies");

  program
  .command("all [base]")
  .description("Get latest exchange rates. Base currency can be passed as an optional parameter. By default it is USD")
  .action((base) => {
    const baseCurr = base!=undefined?base:`USD`
    axios(`${BASE_URL}/latest?base=${baseCurr}&api_key=${API_KEY}`)
      .then(res=>{
        for (let key in res?.data?.response?.rates) {
            allTable.push([chalk.green(key), chalk.cyan(res?.data?.response?.rates[key])])
        } 
        console.log(chalk.cyan(`Base Currency : ${baseCurr}`))
        console.log(allTable.toString());
      })
      .catch(err=>console.log(chalk.red(`Something went wrong !`)))
  })

  program
  .command("details [symbol]")
  .description("Get details about all currency. Symbol can be passed as an optional parameter to get info about single currency")
  .action((symbol) => {
    axios(`${BASE_URL}/currencies?type=fiat&api_key=${API_KEY}`)
      .then(res=>{
     
        if(symbol!=undefined){
          detailTable.push([chalk.green(res?.data?.response?.fiats[symbol.toUpperCase()]?.currency_code), chalk.cyan(res?.data?.response?.fiats[symbol.toUpperCase()]?.currency_name)])
        }else{
          for (let key in res?.data?.response?.fiats) {
            detailTable.push([chalk.green(key), chalk.cyan(res?.data?.response?.fiats[key]?.currency_name)])
          }
        }
        console.log(detailTable.toString());
      })
      .catch(err=>console.log(chalk.red(`Something went wrong !`)))
  })

  program
  .command("convert <from> <to>")
  .description("Get conversion rate of currency. Both parameters are required. ")
  .action((from,to) => {
    const fromCurr = from.toUpperCase()
    const toCurr = to.toUpperCase()
    axios(`${BASE_URL}/latest?base=${fromCurr}&symbols=${toCurr}&api_key=${API_KEY}`)
      .then(res=>{
        console.log(chalk.cyan(`1 ${fromCurr} = ${res?.data?.response?.rates[toCurr]} ${toCurr}`))
      })
      .catch(err=>console.log(chalk.red(`Something went wrong !`)))
  })

  program.parse(process.argv);
