package transaction

type DimeDividendTransaction struct {
	Text string
}

func (b DimeDividendTransaction) ToJson() (*DimeTransactionLog, error) {
	return &DimeTransactionLog{
		Type: "Dividend",
	}, nil
}