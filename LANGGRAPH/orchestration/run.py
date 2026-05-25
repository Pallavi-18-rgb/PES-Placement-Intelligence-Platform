import time
from workflows.graph import graph

if __name__ == '__main__':
    print('Orchestration container started')
    print(f'Loaded orchestration graph: {graph}')
    while True:
        time.sleep(3600)
