export default class CommonUtils {
    constructor() { }

    static generateTreeFromList (listOfNodes) {
        let treeData = []
        listOfNodes = CommonUtils.getFreezedObject(listOfNodes)

        let rootNodeIndexes = []
        let rootNodes = listOfNodes.filter((node, index, arr) => {
            let result = node.parentAggregationId == ''
            if (result) {
                rootNodeIndexes.push(index)
            }
            return result
        })

        // remove root node from list of nodes for optimizing
        for (var index = rootNodeIndexes.length - 1; index >= 0; index--) {
            listOfNodes.splice(rootNodeIndexes[index], 1)
        }

        // find child nodes for all root nodes
        for (let index = 0; index < rootNodes.length; index++) {
            let node = rootNodes[index]

            // search for child nodes for this root node
            let nodeData = CommonUtils.generateTree(
                CommonUtils.getFreezedObject(node),
                listOfNodes
            )

            treeData.push(nodeData)
        }

        return treeData
    }

    static getFreezedObject (object) {
        return JSON.parse(JSON.stringify(object))
    }

    static generateTree (parentNode, listOfNodes) {
        // check node is having child nodes
        if (parentNode.hasChild) {
            // first time create childs list
            parentNode.childs = []

            // search for a child nodes with parent id
            for (let index = 0; index < listOfNodes.length; index++) {
                let childNode = listOfNodes[index]

                // check is child node of this parent
                if (childNode.parentAggregationId === parentNode.aggregationId) {
                    // remove child node from list of nodes for optimizing
                    let newNodeList = CommonUtils.getFreezedObject(listOfNodes)
                    newNodeList.splice(index, 1)

                    // check for it's child nodes (sub child nodes)
                    childNode = CommonUtils.generateTree(childNode, newNodeList)

                    // push child node into parent node
                    parentNode.childs.push(childNode)
                }
            }
        }
        return parentNode
    }

    // To check internet is available or not
    static checkInternet () {
        return navigator.onLine
    }
}
