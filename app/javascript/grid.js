export const COLOURS = ['red', 'green', 'blue', 'yellow'];
export const MAX_X = 10;
export const MAX_Y = 10;

export class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
  }
  
  isGrey() {
    return this.colour == 'grey';
  }
  
  paintGrey() {
    this.colour = 'grey';
  }
  
  paint(colour) {
    if (COLOURS.includes(colour)) {
      this.colour = colour;
    }
  }
  
  isSameColour(other_block) {
    return (other_block != null && this.colour == other_block.colour);
  }
  
  fourWayCoordinates() {
    return [          [this.x, this.y+1],
      [this.x-1, this.y],            [this.x+1, this.y],
                      [this.x, this.y-1],
    ]
  }
}

export class BlockGrid {
  constructor(max_x, max_y) {
    this.max_x = max_x || MAX_X
    this.max_y = max_y || MAX_Y
    
    this.grid = [];

    for (let x = 0; x < this.max_x; x++) {
      let col = [];
      for (let y = 0; y < this.max_y; y++) {
        col.push(new Block(x, y));
      }

      this.grid.push(col);
    }

    return this;
  }

  coordinatesWithinBoundaries(x, y) {
    return (x > -1 && x < this.max_x && y > -1 && y < this.max_y);
  }
  
  connectedBlocks(block, result, searched) {
    result = result || [block];
    searched = searched || [];
    
    if (searched.includes(block)) {
        return;
    }
    
    searched.push(block);
    
    // 4-way connectivity
    for (let [x, y] of block.fourWayCoordinates()) {
        
        if (this.coordinatesWithinBoundaries(x, y)) {
            var next_block = this.grid[x][y]
            
            if (!searched.includes(next_block) && !result.includes(next_block) 
                && block.isSameColour(next_block)) {
                result.push(next_block);
                this.connectedBlocks(next_block, result, searched);
            }
        }
    }
    
    return result;
  }

  fallDownBlocks(affectedColumns) {
    affectedColumns = affectedColumns || [];
    
    for (let x of affectedColumns) {
      for (let y = 0; y < this.max_y; y++) {
        
        var block = this.grid[x][y];
        
        if (block.isGrey()) {
          
          for (let yy = y+1; yy < this.max_y; yy++) {

            var block_above = this.grid[x][yy];
            
            if (!block_above.isGrey()) {
              block.paint(block_above.colour);
              block_above.paintGrey();
              break;
            }
          }
        }
      }
    }
  }

  greyOutConnectedBlocks(block) {
    var affectedColumns = new Set();
    for (var connected_block of this.connectedBlocks(block)) {
      this.grid[connected_block.x][connected_block.y].paintGrey();
      affectedColumns.add(connected_block.x);
    }
    return affectedColumns;
  }

  render(el = document.querySelector('#gridEl')) {
    el.innerHTML = '';
    for (let x = 0; x < this.max_x; x++) {
      let id = 'col_' + x;
      let colEl = document.createElement('div');
      colEl.className = 'col';
      colEl.id = id;
      el.appendChild(colEl);

      for (let y = this.max_y - 1; y >= 0; y--) {
        let block = this.grid[x][y],
          id = `block_${x}x${y}`,
          blockEl = document.createElement('div');

        blockEl.id = id;
        blockEl.className = 'block';
        blockEl.style.background = block.colour;
        blockEl.addEventListener('click', evt => this.blockClicked(evt, block));
        colEl.appendChild(blockEl);
      }
    }

    return this;
  }

  blockClicked(e, block) {
    //console.log(e, block);
    if (!block.isGrey()) {
      let affectedColumns = this.greyOutConnectedBlocks(block);
      this.fallDownBlocks(affectedColumns);
      this.render();
    }
  }
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid().render());
