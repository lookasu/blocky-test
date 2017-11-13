import { Block, BlockGrid, COLOURS, MAX_X, MAX_Y} from './grid';
import { assert } from 'chai';

describe('Block', () => {
  it('should be created with correct coordinates and one of the valid colours', () => {
    let testCoords = [[1, 2], [4, 9], [0, 0]];

    testCoords.forEach(testCoord => {
      let block = new Block(...testCoord);
      assert.equal(block.x, testCoord[0], 'x is set correctly');
      assert.equal(block.y, testCoord[1], 'y is set correctly');
      assert.ok(COLOURS.indexOf(block.colour) > -1, 'colour is valid');
    });
  });
});

describe('Block.isSameColour', () => {
  it('should be true for same colour, false for different', () => {
    // ARRANGE
    let block_yellow = new Block(1, 2);
    block_yellow.colour = 'yellow';

    let block_yellow_too = new Block(1, 2);
    block_yellow_too.colour = 'yellow';
    
    let block_red = new Block(1, 2);
    block_red.colour = 'red';
    
    let block_null = null;
    let block_undefined = undefined;
    
    // ACT/ASSERT
    assert.ok(block_yellow.isSameColour(block_yellow_too), 'colours are same');
    assert.isNotOk(block_yellow.isSameColour(block_red), 'colours are different');
    assert.isNotOk(block_yellow.isSameColour(block_null), 'other block is null');
    assert.isNotOk(block_yellow.isSameColour(block_undefined), 'other block is undefined');
  });
});

describe('Block.fourWayCoordinates', () => {
  it('should return four way coordinates for the block', () => {
    // ARRANGE
    let block = new Block(1, 2);
    let expected_four_way_coordinates = [[1, 3], [0, 2], [2, 2], [1, 1]];
    
    // ACT/ASSERT
    assert.deepEqual(block.fourWayCoordinates(), expected_four_way_coordinates, 'coordinates not equal');
  });
});
    
    
describe('Block.isGrey', () => {
  it('should return true if block is grey', () => {
    // ARRANGE
    let block_not_grey = new Block(1, 2);
    block_not_grey.colour = 'yellow';
    
    let block_grey = new Block(1, 2);
    block_grey.colour = 'grey';
    
    // ACT/ASSERT
    assert.isNotOk(block_not_grey.isGrey(), 'block is not grey');
    assert.ok(block_grey.isGrey(), 'block is grey');
  });
});

describe('Block.paintGrey', () => {
  it('should paint the block grey', () => {
    // ARRANGE
    let block_not_grey = new Block(1, 2);
    block_not_grey.colour = 'yellow';
    
    let block_already_grey = new Block(1, 2);
    block_already_grey.colour = 'grey';
    
    // ACT
    block_not_grey.paintGrey();
    block_already_grey.paintGrey();
    
    //ASSERT
    assert.equal(block_not_grey.colour, 'grey', 'block is grey');
    assert.equal(block_already_grey.colour, 'grey', 'block is already grey');
    
  });
});

describe('Block.paint', () => {
  it('should paint the block with colour', () => {
    // ARRANGE
    let block_yellow_to_red = new Block(1, 2);
    block_yellow_to_red.colour = 'yellow';
    
    let block_yellow_to_magenta = new Block(1, 2);
    block_yellow_to_magenta.colour = 'yellow';
    
    // ACT
    block_yellow_to_red.paint('red');
    block_yellow_to_magenta.paint('magenta');
    
    //ASSERT
    assert.equal(block_yellow_to_red.colour, 'red', 'block is red');
    assert.equal(block_yellow_to_magenta.colour, 'yellow', 'block is still yellow');
    
  });
});

describe('BlockGrid', () => {
  it('should be created with correct boundaries', () => {
    //ARRANGE
    let testCoords = [[1, 2], [4, 9], [0, 0]];
    //ACT/ASSERT 
    testCoords.forEach(testCoord => {
      let block_grid = new BlockGrid(...testCoord);
      assert.equal(block_grid.max_x, testCoord[0], 'max_x is set correctly');
      assert.equal(block_grid.max_y, testCoord[1], 'max_y is set correctly');
    });
    let block_grid = new BlockGrid();
    assert.equal(block_grid.max_x, MAX_X, 'max_x is set correctly');
    assert.equal(block_grid.max_y, MAX_Y, 'max_y is set correctly');
  });
});

describe('BlockGrid.coordinatesWithinBoundaries', () => {
  it('should be true for within boundaries, false for outside', () => {
    // ARRANGE
    let test_coords_within_boundaries = [[1, 2], [4, 9], [0, 0]];
    let test_coords_outside_of_boundaries = [[-1, 2], [14, 9], [-1, -1]];
    let block_grid = new BlockGrid();
    
    // ACT/ASSERT
    test_coords_within_boundaries.forEach(testCoord => {
      assert.ok(block_grid.coordinatesWithinBoundaries(...testCoord), 'coords are valid');
    });
    
    test_coords_outside_of_boundaries.forEach(testCoord => {
      assert.isNotOk(block_grid.coordinatesWithinBoundaries(...testCoord), 'coords are not valid');
    });
  });
});

describe('BlockGrid.connectedBlocks', () => {
  it('should return connected blocks', () => {
    // ARRANGE
    let block_grid = new BlockGrid(2, 2);
    
    let block_yellow = new Block(0, 0);
    block_yellow.colour = 'yellow';
    
    let block_yellow_too = new Block(0, 1);
    block_yellow_too.colour = 'yellow';
    
    let block_red = new Block(1, 0);
    block_red.colour = 'red';
    
    let block_blue = new Block(1, 1);
    block_blue.colour = 'blue';
    
    block_grid.grid = [[block_yellow, block_yellow_too], [block_red, block_blue]];
    
    // ACT/ASSERT
    assert.deepEqual(block_grid.connectedBlocks(block_yellow), [block_yellow, block_yellow_too], 'two yellow blocks');
    assert.deepEqual(block_grid.connectedBlocks(block_red), [block_red], 'only one red block');
  });
});

describe('BlockGrid.greyOutConnectedBlocks', () => {
  it('should return connected blocks', () => {
    // ARRANGE
    let block_grid = new BlockGrid(2, 2);
    
    let block_yellow = new Block(0, 0);
    block_yellow.colour = 'yellow';
    
    let block_yellow_too = new Block(0, 1);
    block_yellow_too.colour = 'yellow';
    
    let block_grey = new Block(0, 0);
    block_grey.colour = 'grey';
    
    let block_grey_too = new Block(0, 1);
    block_grey_too.colour = 'grey';
    
    let block_red = new Block(1, 0);
    block_red.colour = 'red';
    
    let block_blue = new Block(1, 1);
    block_blue.colour = 'blue';
    
    block_grid.grid = [[block_yellow, block_yellow_too], [block_red, block_blue]];
    
    let expected_affected_columns = new Set([0]);
    
    // ACT
    let affected_columns = block_grid.greyOutConnectedBlocks(block_yellow);
    
    // ACT/ASSERT
    assert.deepEqual(affected_columns, expected_affected_columns,'column zero affected');
    assert.deepEqual(block_grid.grid, [[block_grey, block_grey_too], [block_red, block_blue]], 'column zero greyed out');
  });
});

describe('BlockGrid.fallDownBlocks', () => {
  it('should rearrange blocks', () => {
    // ARRANGE
    let block_grid = new BlockGrid(1, 2);
    
    let block_bottom_before = new Block(0, 0);
    block_bottom_before.colour = 'grey';
    
    let block_top_before = new Block(0, 1);
    block_top_before.colour = 'yellow';
    
    let block_bottom_after = new Block(0, 0);
    block_bottom_after.colour = 'yellow';
    
    let block_top_after = new Block(0, 1);
    block_top_after.colour = 'grey';
    
    block_grid.grid = [[block_bottom_before, block_top_before]];
    
    // ACT
    block_grid.fallDownBlocks([0]);
    
    //ASSERT
    assert.deepEqual(block_grid.grid, [[block_bottom_after, block_top_after]], 'grey block on top');
  });
});
