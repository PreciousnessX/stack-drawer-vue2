export const sleep = (time = 0): Promise<boolean> =>
	new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, time);
	});

const OP_PERFIX = '$$';

export const startWidthOpPerfix = (key: string) => key.indexOf(OP_PERFIX) === 0;

export const transformKey = (key: string) => key.slice(OP_PERFIX.length);
