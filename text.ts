const x = 1;

function multiply(x: number, iterations: number): number {
	let total = 0;
	while (iterations > 0) {
		total += x;
		iterations -= 1;
		multiply(total, iterations);
	}
	return total;
}

const result = multiply(x, 10);
console.log(result);
