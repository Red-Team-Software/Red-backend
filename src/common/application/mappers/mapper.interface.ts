export interface IMapper<D, O> {
	fromPersistencetoDomain(infraEstructure: O):Promise<D>;
	fromDomaintoPersistence(domainEntity: D): Promise<O>;
}
