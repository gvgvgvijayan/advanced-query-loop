/**
 * WordPress dependencies
 */
import { SelectControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * PostOrderControls component
 *
 * @param {*} param0
 * @return {Element} PostCountControls
 */
export const PostOrderControls = ( { attributes, setAttributes } ) => {
	const { query: { order, orderBy } = {} } = attributes;
	return (
		<>
			<SelectControl
				label={ __( 'Post Order By', 'advanced-query-loop' ) }
				value={ orderBy }
				help={
					orderBy === 'meta_value' || orderBy === 'meta_value_num'
						? __(
								'Meta Value and Meta Value Num require that Meta Key is set in the Meta Query section.',
								'advanced-query-loop'
						  )
						: ''
				}
				options={ [
					{
						label: __( 'Author', 'advanced-query-loop' ),
						value: 'author',
					},
					{
						label: __( 'Date', 'advanced-query-loop' ),
						value: 'date',
					},
					{
						label: __(
							'Last Modified Date',
							'advanced-query-loop'
						),
						value: 'modified',
					},
					{
						label: __( 'Title', 'advanced-query-loop' ),
						value: 'title',
					},
					{
						label: __( 'Meta Value', 'advanced-query-loop' ),
						value: 'meta_value',
					},
					{
						label: __( 'Meta Value Num', 'advanced-query-loop' ),
						value: 'meta_value_num',
					},
					{
						label: __( 'Random', 'advanced-query-loop' ),
						value: 'rand',
					},
					{
						label: __( 'Menu Order', 'advanced-query-loop' ),
						value: 'menu_order',
					},
					{
						label: __( 'Post ID', 'advanced-query-loop' ),
						value: 'id',
					},
				] }
				onChange={ ( newOrderBy ) => {
					setAttributes( {
						query: {
							...attributes.query,
							orderBy: newOrderBy,
						},
					} );
				} }
			/>
			<ToggleControl
				label={ __( 'Ascending Order', 'advanced-query-loop' ) }
				checked={ order === 'asc' }
				onChange={ () => {
					setAttributes( {
						query: {
							...attributes.query,
							order: order === 'asc' ? 'desc' : 'asc',
						},
					} );
				} }
			/>
		</>
	);
};
