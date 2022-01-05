import { CustomScalar, Scalar } from '@nestjs/graphql';
import { ValueNode } from 'graphql';

@Scalar('Object', (type) => Object)
export class ObjectScalar implements CustomScalar<Object, Object> {
    description? = 'Custom object scalar';

    parseValue(value: Object): Object {
        return value;
    }

    serialize(value: Object): Object {
        return value;
    }

    parseLiteral(ast: ValueNode): Object {
        return null;
    }
}