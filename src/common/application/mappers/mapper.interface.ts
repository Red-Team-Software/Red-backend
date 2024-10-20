export interface IMapper<D, O> {
	toPersistence(domainEntity: D): O;
	toDomain(infraEstructure: O): D;
}
