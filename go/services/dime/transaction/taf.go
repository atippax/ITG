package transaction

type DimeTafTransaction struct {
	Text string
}

func (c DimeTafTransaction) ToJson() (*DimeTransactionLog, error) {
	return &DimeTransactionLog{
		Type: "TAF",
	}, nil
}
