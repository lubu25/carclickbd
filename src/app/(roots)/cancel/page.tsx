import { Button, Result } from 'antd';

const Cancel = () => (
    <Result
        title="Your operation has been executed"
        extra={
            <Button type="primary" key="console">
                Go to pay again
            </Button>
        }
    />
);

export default Cancel;