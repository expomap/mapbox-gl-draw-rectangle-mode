const piOver180 = (Math.PI / 180);

function findThirdPoint(pointA, pointB, bearingInDeg) {
    const absoluteAngle = Math.abs(bearingInDeg);
    
    if (absoluteAngle === 0){
        return {
            x: pointB.x,
            y: pointA.y
        }
    }
    
    if (absoluteAngle === 90){
        return { 
            x: pointA.x, 
            y: pointB.y 
        };
    }

    const bearingInRad = bearingInDeg * piOver180;

    const m1 = Math.tan(bearingInRad);
    const m2 = -1 / m1;

    const c1 = pointA.y - m1 * pointA.x;

    const c2 = pointB.y - m2 * pointB.x;

    const x_intersect = (c2 - c1) / (m1 - m2);
    const y_intersect = m1 * x_intersect + c1;

    return { 
        x: x_intersect, 
        y: y_intersect 
    };
}

function findFourthPoint(pointA, pointB, pointC) {
    const midpointAB = {
        x: (pointA.x + pointB.x) / 2,
        y: (pointA.y + pointB.y) / 2
    };

    return {
        x: 2 * midpointAB.x - pointC.x,
        y: 2 * midpointAB.y - pointC.y
    };
}

export {findThirdPoint, findFourthPoint};