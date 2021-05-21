### Moolahh

A CLI Tool to get real time exchange rates for over 168 world currencies

## 🚀 Installation
```shell
npm i -g moolahh
```

## 📈 Usage

[parameters] - Optional
<parameters> - Required

Get latest exchange rates. Base currency can be passed as an optional parameter. By default it is USD

```shell
moolahh all [base]
```

Get details about all currency. Symbol can be passed as an optional parameter to get info about single currency

```shell
moolahh details [symbol]
```

Get conversion rate of currency. Both parameters are required and should be currency symbols. 

```shell
moolahh convert <from> <to>
```