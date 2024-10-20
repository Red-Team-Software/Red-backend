export interface IAsyncMapper<D, O> {
	toPersistence(domainEntity: D): Promise<O>;
	toDomain(infraEstructure: O): Promise<D>;
}
