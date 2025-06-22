import { isValidCron } from "cron-validator"
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsCronExpression', async: true })
export class IsCronExpressionConstraint implements ValidatorConstraintInterface {
    validate(value: any): Promise<boolean> | boolean {
        return isValidCron(value, { seconds: true })
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'schedule must be a valid cron expression';
    }
}

export function IsCronExpression(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsCronExpressionConstraint,
        });
    }
}