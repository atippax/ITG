package transaction

import (
	"errors"
	"regexp"
	"time"
)

type DimeBuyTransaction struct {
	Text string
}

func (b DimeBuyTransaction) ToJson() (*DimeTransactionLog,error) {
	pattern := `\d{1,2}\s[A-Z][a-z]{2}\s\d{4}\s-\s\d{2}:\d{2}:\d{2}\s(AM|PM)`
	re := regexp.MustCompile(pattern)
	timestamps := re.FindAllString(b.Text,1)
layout := "2006-01-02 15:04:05"
time,err :=time.Parse(layout,timestamps[0])
if (err!=nil){
	return nil,errors.New("can't parse time")
}
	return &DimeTransactionLog{
		Type: "Buy",
		ExecutedDate: time,

	},nil
}