export const linearRegression = (X, Y) => {
    const n = X.length;
    let A = [[0, 0], [0, 0]];
    let B = [0, 0];
    
    // Calcular sumatorias
    for (let i = 0; i < n; i++) {
      A[0][0] += X[i] * X[i];
      A[0][1] += X[i];
      A[1][0] += X[i];
      B[0] += X[i] * Y[i];
      B[1] += Y[i];
    }
    A[1][1] = n;
    
    // Resolver sistema de ecuaciones (Ax = B)
    const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    if (det === 0) return { m: 0, b: 0, r2: 0 };
    
    const m = (A[1][1] * B[0] - A[0][1] * B[1]) / det;
    const b = (A[0][0] * B[1] - A[1][0] * B[0]) / det;
    
    // Calcular R²
    let ssRes = 0;
    let ssTot = 0;
    const yMean = B[1] / n;
    
    for (let i = 0; i < n; i++) {
      const yPred = m * X[i] + b;
      ssRes += Math.pow(Y[i] - yPred, 2);
      ssTot += Math.pow(Y[i] - yMean, 2);
    }
    
    const r2 = 1 - (ssRes / ssTot);
    
    return { m, b, r2 };
  };