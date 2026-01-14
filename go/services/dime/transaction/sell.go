package transaction

type DimeSellTransaction struct {
	Text string
}

func (c DimeSellTransaction) ToJson() (*DimeTransactionLog, error) {
	return &DimeTransactionLog{
		Type: "Sell",
	}, nil
}
