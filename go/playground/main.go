package main

import (
	dimeTransaction "ITG/services/dime/transaction"
	service "ITG/services/image_process"
	"fmt"
	"regexp"
)

func main() {
	text:= service.ParseImagePathToText("../imageTest/1000001055.jpg")
	pattern := `\d{1,2}\s[A-Z][a-z]{2}\s\d{4}\s-\s\d{2}:\d{2}:\d{2}\s(AM|PM)`
	re := regexp.MustCompile(pattern)
	parts := re.Split(text, -1)
	timestamps := re.FindAllString(text, -1)
	transactions := make([]string,len(timestamps))
	for index,timestamp := range timestamps{
		transactions[index] = fmt.Sprintf("%s%s",parts[index],timestamp)
	}

	for _,transaction := range transactions {
		parser,err:= dimeTransaction.NewDimeTransaction(transaction)
		if err!=nil{
			fmt.Println(err.Error())
		}
		fmt.Println(parser.ToJson())
	}
}




