export abstract class Entity<T> {
	private id: T;

	protected constructor(id: T) {
		this.id = id;
	}

	public getId(): T {
		return this.id;
	}

	equals(entity: Entity<T>): boolean {
		return this.id === entity.id;
	}
}
