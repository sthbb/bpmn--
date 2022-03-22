export const xmlStr = `<?xml version="1.0" encoding="UTF-8"?>
<definitions exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="5.1.2" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn"
    xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
    xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
    xmlns:etl="http://etl.org/bpmn"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <bpmndi:BPMNDiagram id="BpmnDiagram_1">
        <bpmndi:BPMNPlane bpmnElement="Process_1" id="BpmnPlane_1">
            <bpmndi:BPMNShape id="TextAnnotation_0wqsa6z_di" bpmnElement="TextAnnotation_0wqsa6z">
                <dc:Bounds x="1480" y="580" width="102" height="32" />
                <bpmndi:BPMNLabel />
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="TextAnnotation_1s6nves_di" bpmnElement="TextAnnotation_1s6nves">
                <dc:Bounds x="1490" y="150" width="102" height="32" />
                <bpmndi:BPMNLabel />
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="etl:Task1647590953861_05i03gl_di" bpmnElement="etl:Task1647590953861_05i03gl">
                <dc:Bounds x="1310" y="220" width="100" height="80" />
                <bpmndi:BPMNLabel />
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="etl:Start1647590949831_0klo73h_di" bpmnElement="etl:Start1647590949831_0klo73h">
                <dc:Bounds x="1324" y="64" width="72" height="72" />
                <bpmndi:BPMNLabel />
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="bpmn:ExclusiveGateway1647590961991_06okfe4_di" bpmnElement="bpmn:ExclusiveGateway1647590961991_06okfe4" isMarkerVisible="true">
                <dc:Bounds x="1335" y="435" width="50" height="50" />
                <bpmndi:BPMNLabel>
                    <dc:Bounds x="1265" y="453" width="77" height="14" />
                </bpmndi:BPMNLabel>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="bpmn:Task1647590968775_0kbms39_di" bpmnElement="bpmn:Task1647590968775_0kbms39">
                <dc:Bounds x="1310" y="610" width="100" height="80" />
                <bpmndi:BPMNLabel />
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="etl:End1647590971597_0ltgb4q_di" bpmnElement="etl:End1647590971597_0ltgb4q">
                <dc:Bounds x="1324" y="824" width="72" height="72" />
                <bpmndi:BPMNLabel />
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="etl:End1647590974419_1w7o60f_di" bpmnElement="etl:End1647590974419_1w7o60f">
                <dc:Bounds x="1574" y="424" width="72" height="72" />
                <bpmndi:BPMNLabel />
            </bpmndi:BPMNShape>
            <bpmndi:BPMNEdge id="Flow_192kh2q_di" bpmnElement="Flow_192kh2q">
                <di:waypoint x="1360" y="690" />
                <di:waypoint x="1360" y="824" />
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge id="Flow_1h55b6g_di" bpmnElement="Flow_1h55b6g">
                <di:waypoint x="1385" y="460" />
                <di:waypoint x="1574" y="460" />
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge id="Flow_1h3t5to_di" bpmnElement="Flow_1h3t5to">
                <di:waypoint x="1360" y="485" />
                <di:waypoint x="1360" y="610" />
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge id="Flow_0mhzd7w_di" bpmnElement="Flow_0mhzd7w">
                <di:waypoint x="1360" y="300" />
                <di:waypoint x="1360" y="435" />
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge id="Flow_0y2hlod_di" bpmnElement="Flow_0y2hlod">
                <di:waypoint x="1360" y="136" />
                <di:waypoint x="1360" y="220" />
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge id="Association_04rwwn6_di" bpmnElement="Association_04rwwn6">
                <di:waypoint x="1410" y="634" />
                <di:waypoint x="1480" y="611" />
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge id="Association_1hhv8y6_di" bpmnElement="Association_1hhv8y6">
                <di:waypoint x="1410" y="232" />
                <di:waypoint x="1511" y="182" />
            </bpmndi:BPMNEdge>
        </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
    <process id="Process_1" isExecutable="false">
        <textAnnotation id="TextAnnotation_1s6nves">
            <text>主要消息</text>
        </textAnnotation>
        <textAnnotation id="TextAnnotation_0wqsa6z">
            <text>次要消息</text>
        </textAnnotation>
        <etl:task id="etl:Task1647590953861_05i03gl" name="第一次发消息">
            <incoming>Flow_0y2hlod</incoming>
            <outgoing>Flow_0mhzd7w</outgoing>
        </etl:task>
        <task id="bpmn:Task1647590968775_0kbms39" name="第二次发消息">
            <incoming>Flow_1h3t5to</incoming>
            <outgoing>Flow_192kh2q</outgoing>
        </task>
        <etl:start id="etl:Start1647590949831_0klo73h" name="开始">
            <outgoing>Flow_0y2hlod</outgoing>
        </etl:start>
        <sequenceFlow id="Flow_0y2hlod" sourceRef="etl:Start1647590949831_0klo73h" targetRef="etl:Task1647590953861_05i03gl" />
        <sequenceFlow id="Flow_0mhzd7w" sourceRef="etl:Task1647590953861_05i03gl" targetRef="bpmn:ExclusiveGateway1647590961991_06okfe4" />
        <sequenceFlow id="Flow_1h3t5to" sourceRef="bpmn:ExclusiveGateway1647590961991_06okfe4" targetRef="bpmn:Task1647590968775_0kbms39" />
        <sequenceFlow id="Flow_1h55b6g" sourceRef="bpmn:ExclusiveGateway1647590961991_06okfe4" targetRef="etl:End1647590974419_1w7o60f" />
        <sequenceFlow id="Flow_192kh2q" sourceRef="bpmn:Task1647590968775_0kbms39" targetRef="etl:End1647590971597_0ltgb4q" />
        <exclusiveGateway id="bpmn:ExclusiveGateway1647590961991_06okfe4" name="是否可以发消息">
            <incoming>Flow_0mhzd7w</incoming>
            <outgoing>Flow_1h3t5to</outgoing>
            <outgoing>Flow_1h55b6g</outgoing>
        </exclusiveGateway>
        <association id="Association_1hhv8y6" sourceRef="etl:Task1647590953861_05i03gl" targetRef="TextAnnotation_1s6nves" />
        <association id="Association_04rwwn6" sourceRef="bpmn:Task1647590968775_0kbms39" targetRef="TextAnnotation_0wqsa6z" />
        <etl:end id="etl:End1647590971597_0ltgb4q" name="结束">
            <incoming>Flow_192kh2q</incoming>
        </etl:end>
        <etl:end id="etl:End1647590974419_1w7o60f" name="结束">
            <incoming>Flow_1h55b6g</incoming>
        </etl:end>
    </process>
</definitions>
`
