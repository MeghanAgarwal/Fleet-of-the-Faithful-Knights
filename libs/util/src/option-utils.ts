import {Collection, List} from 'immutable';
import {Option, Some} from 'funfix-core';

export class OptionUtils {

	static toCollection<T>(items: Collection<any, Option<T>>): Collection<any, T> {
		return items.filter(v => !v.isEmpty())
			.map(v => v.get());
	}

	static toList<T>(...items: Option<T>[]): List<T> {
		return OptionUtils.toCollection(List.of(...items)).toList();
	}


}